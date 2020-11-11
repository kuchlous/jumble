#!/usr/bin/env ruby

require "common"

def delete_file(file)
  @aws_s3.delete(@s3_bucket, file)
end

# Retrieve the files matching filename_prefix in the S3 bucket
def delete_files(filename_prefix)
  list_keys(filename_prefix).each do |k|
   delete_file(k)
   puts "Trying to delete #{k} from bucket #{@s3_bucket}"
  end
end


begin
  FileUtils.mkdir_p @temp_dir

  # assumes the bucket's empty
  dump_file = "#{@temp_dir}/dump.sql.gz"

  cmd = "mysqldump --quick --single-transaction --create-options -u#{@mysql_user}  --flush-logs --master-data=2 --delete-master-logs"
  cmd += " -p'#{@mysql_password}'" unless @mysql_password.nil?
  cmd += " #{@mysql_database} | gzip > #{dump_file}"
  run(cmd)

  @aws_s3.put(@s3_bucket, File.basename(dump_file), File.open(dump_file))

  delete_files("mysql-bin.");

ensure
  FileUtils.rm_rf(@temp_dir)
end
