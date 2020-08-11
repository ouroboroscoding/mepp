apt-get -qq install software-properties-common
add-apt-repository ppa:certbot/certbot
apt-get -qq update
apt-get -qq install python-certbot-nginx
apt-get -qq install python-pip
mkdir -p /root/venvs/certbot
virtualenv -p /usr/bin/python3 /root/venvs/certbot
/root/venvs/certbot/bin/pip install certbot-cpanel
/root/venvs/certbot/bin/certbot certonly --authenticator certbot-cpanel:dns-cpanel --certbot-cpanel:dns-cpanel-propagation-seconds 30 -d my.maleexcel.com --server https://acme-v02.api.letsencrypt.org/directory

#/root/venvs/certbot/bin/certbot renew
