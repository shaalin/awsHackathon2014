#!/bin/bash -x

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

#update all packages
echo start yum update
yum update -y
echo end yum update

#echo print stopping any other forever process
su - ec2-user -c "echo $PATH && exec /usr/local/bin/forever stopall"

#making golfkick server log director
mkdir -p /home/ec2-user/awsHackathon2014/apiServer/log

chown ec2-user:ec2-user home/ec2-user/awsHackathon2014/apiServer/log

chmod 755 /home/ec2-user/awsHackathon2014/apiServer/log

#Section to start api server
su - ec2-user -c "cd ~/awsHackathon2014/apiServer && npm install && export NODE_ENV=dev && exec /usr/local/bin/forever start -l forever-api.log -o log/log-api.log -e log/err-api.log --append --silent master.js && exec exit"
