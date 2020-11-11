namespace :db do
  desc 'Populate the words database'
  LARGE_NUM = 100000

  def read_homophones(filename)
    file = File.open(filename, 'r')
    words = []
    file.each do |line|
      line.chomp!
      homophones = line.split('/')
      puts homophones
      words << homophones
    end
    words
  end

  def save_homophones(dict_words)
    dict_words.each do |homophones|
      homophones.each_with_index do |homophone, i|
        jword = Word.find_by_word(homophone) 
        if (jword)
          hcopy = homophones.clone
          hcopy.delete(hcopy[i])
          hcopy = hcopy.find_all { |s| /^[a-zA-Z]*$/.match(s) }
          if (hcopy.size > 0) 
            hstring = hcopy.join(',')
            if (jword.homophone)
              hstring = jword.homophone + ',' + hstring
            end
            puts "Trying to save #{homophone} with homophone #{hstring}"
            jword.homophone = hstring
            jword.save
          end
        end
      end
    end
  end

  task :populate_homophones, :filename do |t, args|
    Rake::Task["environment"].invoke
    # args.with_defaults(:filename => "/etc/dictionaries-common/words")
    homophones = read_homophones(args[:filename])
    # puts dict_words
    save_homophones(homophones)
  end
end

