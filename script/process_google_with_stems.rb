#!/home/mirafra/.rvm/rubies/ruby-1.9.2-p180/bin/ruby

filename = "doc/google_words.csv"
puts "Opening #{filename}"
file = File.open(filename, 'r')
words = {}
file.each do |line|
  word, count0 = line.split
  word = word.stem
  words[word] ||= 0
  words[word] += count0.to_i
end
file.close

file = File.open("doc/google_word_stems.csv", 'w')
words.each do |word, count|
  file.puts "#{word} #{count}"
end
file.close
