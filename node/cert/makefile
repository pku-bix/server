
cert.pem: cert.cer
	openssl x509 -in cert.cer -inform DER -outform PEM -out cert.pem

key.pem: key.p12
	openssl pkcs12 -in key.p12 -out key.pem -nodes
