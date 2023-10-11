#!/bin/sh
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

PRIVATE_KEY=`cat private.pem`
PUBLIC_KEY=`cat public.pem`

#PUBLIC_KEY_CLEAN="${PUBLIC_KEY//$'\n'/'\n'}"
#PRIVATE_KEY_CLEAN="${PRIVATE_KEY//$'\n'/'\n'}"

echo
echo "$PRIVATE_KEY"
echo
echo "$PUBLIC_KEY}"
echo
