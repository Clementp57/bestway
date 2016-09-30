openssl genrsa -out ../../sslcert/bestway.key 1024
openssl req -new -key ../../sslcert/bestway.key -out ../../sslcert/bestway.csr
openssl x509 -req -days 365 -in ../../sslcert/bestway.csr -signkey ../../sslcert/bestway.key -out ../../sslcert/bestway.crt
cat ../../sslcert/bestway.crt ../../sslcert/bestway.key | sudo tee ../../sslcert/bestway.pem
mv ../../sslcert/bestway.pem ../../dockerBuilds/haproxy