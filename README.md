# wps_rest_api
Test for WPS hiring process

Basic architectural notes on what tools were used to build the service:

1. Typescript is used to implement this service and TypeORM is used to support ORM mapping.  
   https://typeorm.io/#/
   Auth Tokenization was implemented using jwt module.
   
2. I did not implement any sort of caching, so the service is simply reading the database table and accessing sending out query results    without any sort of caching. REDIS of course is a possibility as well as MYSQL itself - if the size of your DBs in 500-900 GB you        could easily fit everything in My SQL cache.  Also TypeORM supports interface to REDIS and is well suited for implmenenting caching
   that is aligned with MYSQL.

3. I DID implement token-based security authorization and created a user and password table - user passwords are all set to be "wps"
   Passwords themselves are not obfuscated in any way.

4. Node.js service is running on this ip - 52.9.30.45 on port 8080 - I did not implement port forwarding so all curl calls go to a   
   specific port as well as specific ip.

   MYSQL is running and is remotely accessible - i'll email u details.
         
5. There are two tables there : customer and user - in a schema called wps_data

6. Both tables can be viewed through REST API calls to appropriate endpoints ( customer and user ) provided an auth token are requested    before hand and are used

7. I implemented sorting and filtering and field selection in the API calls to provide a more database-like access capabilities in the 
   API for reading the table data/
   
8. It is fairly simple to add new tables to this service and it was designed to allow very simple process for transitioning SQL access      to table entities into REST API paradime.   

9. code lives in this location on 59.9.30.45 machine

   /home/ubuntu/wps_rest_api

   to start the service just run npm start

### below is list of operations supported by the API in form of example curl calls

ip 52.9.30.45 is public and available - elastic IP on AWS assiged to instance running node.js service

Following operations are available from service

## get an auth token
curl "http://52.9.30.45:8080/getAuth?userId=arovinsky&password=wps"

### auth token has this form below ("auth:" needs to be pre-pended to the token for this to work)
auth:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhcm92aW5za3kiLCJ1c2VybmFtZSI6ImFsZXggcm92aW5za3kiLCJpYXQiOjE1Njg2MzMxMTYsImV4cCI6MTU2ODYzMzIzNn0.7VcfuZvscqqkAKQRrWvre0_UzYbWQrU2KFMzFCIBw6c

## get a customer by id - replace XXXs with token from previous call
curl -H  "auth:XXXX" http://52.9.30.45:8080/customer/1

## get all customers - replace XXXs with token from previous call
curl -H  "auth:XXXX" http://52.9.30.45:8080/customer

## GET all users - replace XXXs with token from previous call
curl -H  "auth:XXXX" http://52.9.30.45:8080/user

## GET customers via query parameters - replace XXXs with token from previous call
curl -H  "auth:XXXX" http://52.9.30.45:8080/customer?age=[30-40]&select=firstName,lastName,age&sort=age:ASC
curl -H  "auth:XXXX" http://52.9.30.45:8080/customer?filter=age=[41-50],lastName=Setts&select=age,profession,lastName


## below is an example of post - adding a new customer ( after requesting an auth key first )

curl "http://52.9.30.45:8080/getAuth?userId=arovinsky&password=wps"
## ------------ Returned auth key ----------------
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhc58m92aW5za3kiLCJpYXQiOjE1Njg2NDQxMzgsImV4cCI6MTU2ODY0NDM3OH0.EJXI_kCgB_4ws5ImsOvk5fWX7XNSaH64QbfwAx2GGBk
## ------------- Auth key used to run create operation ---------------------------------
curl -H  "auth:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhcm92aW5za3kiLCJpYXQiOjE1Njg2NDQxMzgsImV4cCI6MTU2ODY0NDM3OH0.EJXI_kCgB_4ws5ImsOvk5fWX7XNSaH64QbfwAx2GGBk" -d '{"firstName": "Dina","lastName": "Boreal","age": 21,"profession": "Chef"}' -H "Content-Type: application/json" -X POST http://52.9.30.45:8080/customer
## ------------- result of the create operation ----------------------------------------
{"firstName":"Dina","lastName":"Boreal","age":21,"profession":"Chef","dateCreated":null,"id":9}

## below is an example of DELETE - removing a customer ( with an auth key )
curl -H  "auth:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhcm92aW5za3kiLCJpYXQiOjE1Njg2NDQ1MTYsImV4cCI6MTU2ODY0NDc1Nn0.KVXIzoCFfyQNubuVUmyXXQqIjnnNdD4ljmvhA4EnS-A" -d '{"firstName": "Dina","lastName": "Boreal","age": 21,"profession": "Chef"}' -H "Content-Type: application/json" -X DELETE http://52.9.30.45:8080/customer/9

## there is also a PUT operation implemented to support record updates.
