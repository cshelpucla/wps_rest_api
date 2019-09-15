mysqldump  --single-transaction=TRUE  --host="slg-dev-wp-db.cpibjjjuwtzj.us-west-2.rds.amazonaws.com" --user="devuser23452345" --password="1324234sdnenxsdh" slgwp_prod > slgwp_prod_07_16_2019.sql
 grep -n "Table structure" slgwp_prod_07_16_2019.sql 

grep -n "Table structure" slgwp_prod_07_16_2019.sql
