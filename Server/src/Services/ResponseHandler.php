<?php

namespace App\Services;

    class ResponseHandler{

        /**
         * Geef response terug wanneer payload niet volledig is
         */
        function badRequest( array $data = [] ) {
            print( json_encode( array_merge( ["code"=>400, "message"=>"Bad Request"], $data ) ) );
            header('Access-Control-Allow-Origin: https://de-gallo-hoeve.vercel.app');
            header("HTTP/1.1 400");
            exit();
        }

        /**
         * Geef response terug wanneer resource niet gevonden.
         */
        function NotFound(array $data = []): void{
            print( json_encode( array_merge( ["code"=>404, "message"=>"Not Found"], $data ) ) );
            header('Access-Control-Allow-Origin: https://de-gallo-hoeve.vercel.app');
            header("HTTP/1.1 404");
            exit();
        }

        function unprocessableEntity( array $data = [] ): void{
            print( json_encode( array_merge( ["code"=>422, "message"=>"Not Found"], $data ) ) );
            header('Access-Control-Allow-Origin: https://de-gallo-hoeve.vercel.app');
            header("HTTP/1.1 422");
            exit();
        }

        /**
         * Geef Response terug wanneer database error.
         */
        function internalServerError( array $data = [] ): void {
            print( json_encode( array_merge( ["code" => 500, "message"=>"Internal Server Error"], $data ) ) );
            header('Access-Control-Allow-Origin: https://de-gallo-hoeve.vercel.app');
            header("HTTP/1.1 500");
            exit();
        }
    }