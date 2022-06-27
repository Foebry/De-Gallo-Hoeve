<?php

namespace App\Services;

use App\Services\DbManager;
use Error;
use DateTime;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class Validator {

    private $dbm;
    private $request;
    private $responseHandler;

    function __construct( DbManager $dbm, RequestStack $requestStack, ResponseHandler $rh )
    {
        $this->dbm = $dbm;
        $this->requestStack = $requestStack;
        $this->request = $requestStack->getCurrentRequest();
        $this->responseHandler = $rh;
    }

    function validatePayload( $table = null, $payload = null ) {

        $validatedPayload = [];

        $table = $table ?? $this->getTableFromRequestUri();
        $payload = $payload ?? $this->request->getContent();
        $payloadArray = is_array($payload) ? $payload : json_decode( $payload, true );
        $payloadKeys = array_keys( $payloadArray );
        $method = $this->request->getMethod();

        $tableHeaders = $this->dbm->getTableHeaders( $table );
        
        foreach( $tableHeaders as $column => $metadata ){

            $datatype = $metadata["datatype"];
            $unique = $metadata["key"] === "UNI";
            $columnCanBeNull = $metadata["is_null"] === "YES";

            if( $metadata["key"] === "PRI" ) continue;
            if( !in_array( $column, $payloadKeys ) && $method === "PATCH" ) continue;
            if ( in_array( $column, $payloadKeys ) && $payloadArray[$column] === "" ) unset( $payloadArray[$column] );
            $payloadKeys = array_keys( $payloadArray );

            $missingData = ( !$columnCanBeNull && !in_array( $column, $payloadKeys ) && $method === "POST" );
            $requiresDefaultValue = ( !in_array( $column, $payloadKeys ) && !$missingData && $method === "POST" );

            if( $missingData ) {
                $message = "Mag niet leeg zijn";
                if ($datatype === "tinyint") $message = "Gelieve te selecteren";
                $this->responseHandler->badRequest( [$column => $message] );
            }
            
            if( $requiresDefaultValue ) continue;

            if( $unique && $this->violatesUniqueRestraint( $method, $table, $column, $payloadArray[$column] ) ) $this->responseHandler->badRequest( [$column => "Is reeds in gebruik"] );

            $validatedValue = null;

            switch( $datatype ){
                case in_array( $datatype, ["date", "datetime"] ): 
                    $validatedValue = $this->validateDate( $payloadArray[$column] , $column, $datatype === "datetime" );
                    break;
                case "int": 
                    $validatedValue = $this->validateInteger( $payloadArray[$column], $column );
                    break;
                case in_array( $datatype, ["varchar", "longtext"] ):
                    $validatedValue = $this->validateString( $payloadArray[$column], $column, $metadata["max_size"] );
                    break;
                case "tinyint":
                    $validatedValue = $this->validateBoolean( $payloadArray[$column], $column );
                    break;
            }
            $validatedPayload[$column] = $validatedValue;
        }
        return $validatedPayload;
    }

    /**
     * valideert correct Date format
     */
    function validateDate( $value, $column, $time=false ): string{
        $correctFormat = DateTime::createFromFormat( "Y-m-d H:i:s", $value ) || DateTime::createFromFormat( "Y-m-d", $value);
        if( !$correctFormat ) $this->responseHandler->badRequest( [$column => "Ongeldige datum"] );

        $date = new DateTime($value);

        return $time ? $date->format("Y-m-d H:00:00") : $date->format("Y-m-d");
    }


    /**
     * valideert correct numeriek veld
     */
    function validateInteger( $value, $column ): int {
        
        if( !is_numeric( $value ) ) $this->responseHandler->badRequest( [$column => "Gelieve een numerieke waarde in te geven" ] );

        return intval( $value );
    }

    /**
     * valideert correct string veld
     */
    function validateString( $value, $column, $maxLength ): string {

        $value = htmlentities( trim( $value ), ENT_QUOTES );
        $str_len = strlen($value);

        if( $str_len > $maxLength ) {
            $count = $str_len - $maxLength;
            $this->responseHandler->badRequest( [$column => "input is $count characters te lang."] );
        }

        return $value;

    }

    /**
     * geeft 0 of 1 terug indien een geldige boolean meegegeven
     */
    function validateBoolean( $value, $column ): int {

        if( !is_bool( $value) ) $this->responseHandler->badRequest( [$column => "invalid boolean"] );

        return intval( $value );
    }

    function validateCSRF( $payload ){
        $incorrect_csrf = !in_array("csrf", array_keys($payload)) || $payload["csrf"] != $_ENV["CSRF"];
        $incorrect_csrf && $this->responseHandler
                                ->unprocessableEntity(["failure" => "Uw verzoek kan niet worden verwerkt. Probeer het later opnieuw."]);
        
        
    }

    /**
     * geeft tabelnaam terug die van toepassing is voor de huidige request.
     * @return string
     */
    function getTableFromRequestUri(): string{
        $uri = $this->request->getRequestUri();

        $endpointMappings = [
            "boekings" => "boeking",
            "honds" => "hond",
            "hond" => "hond",
            "inschrijvings" => "inschrijving",
            "register" => "klant",
        ];

        $temp = explode( "api/", $uri )[1];
        $endpoint = strpos( $temp, "/" ) !== false ? explode( "/", $temp )[0] : $temp;

        return $endpointMappings[$endpoint];
    }

    /**
     * 
     */
    function violatesUniqueRestraint( $method, $table, $column, $value, $id=null ) {

        $data = null;
        if( $method === "POST" ) $data = $this->dbm->query( 
            "select id from $table where $column = :value" , ["value" => $value] 
        );
        elseif( $method === "PATCH" ) $data = $this->dbm->query( 
            "select id from $table where $column = :value and not id = :id", ["value" => $value, "id" => $id]
        );

        return count( $data ) > 0;

    }

    /**
     * Controleer of embedded payload array steeds unieke waarden bevat, 
     * gechecked op key, met function.
     * @return bool
     */
    function controleerUniekeEntiteiten( array $rows, string $key, $function ): bool{
        
        $ids = [];
        foreach( $rows as $row){

            if( in_array( $row[$key], $ids ) ) return false;

            $function( $row[$key] );
            
            $ids[] = $row[$key];
        }
        return true;
    }

    function isFutureDate( string $date ){
        
        $now = new DateTime();
        $now = new DateTime( $now->format( "Y-m-d" ) );
        $date = new DateTime( $date );

        if( $now > $date ) $this->responseHandler->badRequest( ["message" => "Gelieve een toekomstige datum te kiezen" ] );
    }
}