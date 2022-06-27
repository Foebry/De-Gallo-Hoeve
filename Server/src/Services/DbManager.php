<?php

namespace App\Services;

use Error;
use PDO;
use PDOException;

  class DbManager {
    public $responseHandler;
    public $logger;
    private $connection;
		private $db_url;
		private $db_user;
		private $db_pwd;
    private $schema;

    public function __construct(Logger $logger, ResponseHandler $rh, $db_url, $db_user, $db_pwd, string $schema) {
			$this->logger = $logger;
      $this->responseHandler = $rh;
			$this->db_url = $db_url;
			$this->db_user = $db_user;
			$this->db_pwd = $db_pwd;
      $this->connection = null;
      $this->schema = $schema;
    }

    public function getConnection() {
      if ($this->connection === null) { 
        try {
          $this->connection = new PDO($this->db_url, $this->db_user, $this->db_pwd);
          $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } 
        catch (Error $error) {
          $this->logger->error($error->getMessage(), "error");
          $this->responseHandler->internalServerError( ["message" => "Failed to connect" ] );
        }
      }
      return $this->connection;
    }

    public function closeConnection() {
      $this->connection = null;
    }

    public function query( string $query, array $vars = [], $lastInsertTable=null ) {

      $conn = $this->getConnection();
      $result = null;
      
      try{
        $stmt = $conn->prepare( $query );
        $this->logger->db( $query, $vars );
        $stmt->execute( $vars );
        $result = $lastInsertTable ? true : ($stmt->rowCount() > 0 ? $stmt->fetchAll( PDO::FETCH_ASSOC ) : []);
      }
      catch(PDOException $e) {
        $this->logger->error( $e->getMessage() );
        $this->responseHandler->internalServerError();
      }

      if( $result === false ) return false;

      if( $lastInsertTable ) return $conn->lastInsertId( $lastInsertTable );
      return $result;
    }

    function generateUpdateStatement( string $table, array $data, int $id) {

      $set = $this->generateSetString( $data );

      $query = "update $table set $set where id = :id";
      $this->query( $query, array_merge( $data, ["id"=>$id] ), $table );
    }

    function generateInsertStatmentAndGetInsertId( string $table, array $data ): int{

      $set = $this->generateSetString( $data );
      $query = "insert into $table set $set";
      $id = $this->query($query, $data, $table);

      return $id;
    }

    private function generateSetString( array $data ): string {
      $set = [];
      foreach( array_keys( $data ) as $key ){
        $set[] = "$key = :$key";
      }
      return implode(",\n", $set);
    }

    public function getTableHeaders(string $table): array{
      $headers = [];

      $query = "select * from information_schema.columns where table_name = :table_name and table_schema = :schema";
      $vars = ["table_name" => $table, "schema" => $this->schema];

      $data = $this->query( $query, $vars );

      foreach($data as $row){
        $column = $row["COLUMN_NAME"];
        $column_datatype = $row["DATA_TYPE"];
        $column_key = $row["COLUMN_KEY"];
        $column_max_length = $row["CHARACTER_MAXIMUM_LENGTH"];
        $is_null = $row["IS_NULLABLE"];

        // nieuwe associatieve array aanmaken met nodige data. en toevoegen aan de $headers array
        $headers[$column] = [];
        $headers[$column]["datatype"] = $column_datatype;
        $headers[$column]["key"] = $column_key;
        $headers[$column]["max_size"] = $column_max_length;
        $headers[$column]["is_null"] = $is_null;
      }

      return $headers;
    }

  }