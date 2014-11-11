#!/bin/bash -x

exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

#update all packages
echo start yum update
yum update -y
echo end yum update

working_dir="/home/ec2-user/awsHackathon2014/apiServer"

echo "$(pwd)"
#echo print stopping any other forever process
/usr/bin/forever stopall

#making golfkick server log director
mkdir -p $working_dir/log

chown ec2-user:ec2-user $working_dir/log

chmod 755 $working_dir/log

#Section to start api server
cd $working_dir
npm install
source $working_dir/scripts/DB-Var
export NODE_ENV=dev
/usr/bin/forever start -l forever-api.log -o $working_dir/log/log-api.log -e $working_dir/log/err-api.log --append /home/ec2-user/awsHackathon2014/apiServer/master.js

