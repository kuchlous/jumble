require "config"

require "rubygems"
require "aws"
require "fileutils"

def run(command)
  result = system(command)
  raise("error, process exited with status #{$?.exitstatus}") unless result
end

def execute_sql(sql)
  cmd = %{mysql -u#{@mysql_user} -e "#{sql}"}
  cmd += " -p'#{@mysql_password}' " unless @mysql_password.nil?
  run cmd
end

# List the files matching filename_prefix in the S3 bucket
def list_keys(filename_prefix)
  temp_s3_bucket = @s3_bucket.clone
  keys = @aws_s3.list_bucket(temp_s3_bucket, :prefix => filename_prefix).collect{|obj| obj[:key]}
end

# @aws_s3 = Aws::S3.new(:aws_access_key_id => @aws_access_key_id, :aws_secret_access_key => @aws_secret_access_key, :use_ssl => true)
@aws_s3 = Aws::S3Interface.new(@aws_access_key_id, @aws_secret_access_key)

# It doesn't hurt to try to create a bucket that already exists
# s3_bucket = @aws_s3.bucket(@s3_bucket, true)
@aws_s3.create_bucket(@s3_bucket)

