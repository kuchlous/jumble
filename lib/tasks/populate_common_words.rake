namespace :db do
  desc 'Populate the words database'

  def read_dict_words(filename)
    file = File.open(filename, 'r')
    words = []
    file.each do |line|
      if (/^(\d+)\W+([a-zA-Z]+)/.match(line))
        puts "#{$1} #{$2}"
        rank = $1.to_i
        word = $2
        word = word.downcase
        word_rank = {}
        word_rank[:word] = word
        word_rank[:rank] = rank
        words << word_rank 
      end
    end
    words
  end

  def save_words_simple(dict_words)
    dict_words.each do |word_rank|
      word = word_rank[:word]
      pop_rank = word_rank[:rank]
      jword = Word.find_by_word(word) 
      if (!jword)
        jword = Word.new(:word => word)
      end
      jword.pop_rank = pop_rank
      puts "Trying to save #{word} with rank #{pop_rank}"
      jword.save
    end
  end

  task :populate_common_words, :filename do |t, args|
    Rake::Task["environment"].invoke
    # args.with_defaults(:filename => "/etc/dictionaries-common/words")
    dict_words = read_dict_words(args[:filename])
    puts dict_words
    save_words_simple(dict_words)
  end
end

