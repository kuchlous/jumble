#!/home/mirafra/.rvm/rubies/ruby-1.9.2-p180/bin/ruby

basefilename = ARGV[0]
htmlfilename = basefilename + ".txt"
txtfilename = basefilename + "_simple.txt"
puts "Opening #{htmlfilename}"
file = File.open(htmlfilename, "r")
wfile = File.open(txtfilename, "w")
file = File.open(htmlfilename, "r")
word = ""
rank = ""
file.each do |line|
  if (/word=([a-zA-Z]*)/.match(line))
    word = $1
  end
  if (/&rank=(\d+)\"/.match(line)) 
    rank = $1
    wfile.puts "#{rank} \t #{word}"
  end
end
file.close
wfile.close
