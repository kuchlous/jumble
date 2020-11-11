#!/home/mirafra/.rvm/rubies/ruby-1.9.2-p180/bin/ruby
words = {}
ARGV.each do |filename|
  puts "Opening #{filename}"
  file = File.open(filename, 'r')
  file.each do |line|
    word, year, count0, count1, count2 = line.split
    if (year.to_i > 1960)
      if /^[a-z]*$/.match(word)
        words[word] ||= 0
        words[word] += count0.to_i
      end
    end
  end
  file.close
end

file = File.open("google_words.csv", 'w')
words.each do |word, count|
  file.puts "#{word} #{count}"
end
file.close
