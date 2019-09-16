# wps_rest_api
Test for WPS hiring process

Basic architectural notes on what tools were used to build the service:

1. Typescript is used to implement this service and TypeORM is used to support ORM mapping.  Tokenization was implemented using jwt

2. I did not implement any sort of caching, so the service is simply reading the database table and accessing sending out query results    without any sort of caching. REDIS of course is a possibility as well as MYSQL itself - if the size of your DBs in 500-900 GB you        could easily fit everything in My SQL cache.  Also TypeORM supports interface to REDIS and is well suited for implmenenting caching
   that is aligned with MYSQL.

3. I did implement security token and created a user and password table - user passwords are all set to wps

3. MYSQL is running on this location - and is remotely accessible
   
      MYSQL Db name: database-1.cewgppn79emi.us-west-1.rds.amazonaws.com
      user/password: admin/cshelpaws
      
4. There are two tables there : customer and user - in a schema called wps_data

5. Both tables can be viewed through REST API calls to appropriate endpoints ( customer and user ) provided an auth token are requested    before hand and are used

6. I implemented sorting and filtering and field selection in the API calls to provide a more database-like access capabilities in the 
   API

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

## GET users via query parameters - replace XXXs with token from previous call
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
