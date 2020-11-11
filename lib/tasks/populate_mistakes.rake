namespace :db do
  desc 'Populate the words database'
  LARGE_NUM = 100000

  def read_mistakes(filename)
    file = File.open(filename, 'r')
    words = []
    file.each do |line|
      line.chomp!
      if /^([a-zA-Z]*) - (.*)/.match(line)
        word = $1
        mistakes = $2
        mistakes.gsub!(/\s+/,'')
        new_word = {}
        new_word[:word] = word
        new_word[:mistakes] = mistakes
        words << new_word
      end
    end
    words
  end

  def save_mistakes(dict_words)
    dict_words.each do |word_mis|
      jword = Word.find_by_word(word_mis[:word]) 
      if (jword)
        mistakes = word_mis[:mistakes]
        mistakes = mistakes.split(',')
        mistakes = mistakes.find_all { |s| /^[a-zA-Z]*$/.match(s) }
        if (mistakes.size > 0) 
          hstring = mistakes.join(',')
          if (jword.misspellings)
            hstring = jword.misspellings + ',' + hstring
          end
          puts "Trying to save #{word_mis[:word]} with misspellings #{hstring}"
          jword.misspellings = hstring
          jword.save
        end
      end
    end
  end

  task :populate_mistakes, :filename do |t, args|
    Rake::Task["environment"].invoke
    # args.with_defaults(:filename => "/etc/dictionaries-common/words")
    mistakes = read_mistakes(args[:filename])
    puts mistakes
    save_mistakes(mistakes)
  end
end

