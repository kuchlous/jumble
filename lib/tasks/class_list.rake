namespace :db do
  desc 'Populate the words database'
  LARGE_NUM = 100000

  def cl_read_common_words
    common_words = {}
    file = File.open(Rails.root + 'doc/BingBodyJun09_Top100KWords.txt', 'r')
    rindex = 0
    file.each_with_index do |line, index|
      word = line.chomp
      if /^[a-z]*$/.match(word)
        sword = word.stem
        if (common_words[sword] == nil)
          common_words[sword] = rindex
          rindex += 1
        end
      end
    end
    puts "Read bing words"
    common_words
  end

  def cl_read_common_words_google
    common_words = {}
    file = File.open(Rails.root + 'doc/google_word_stems.csv', 'r')
    file.each_with_index do |line, index|
      word, count = line.split
      common_words[word] = count.to_i
    end

    # sort on frequeny
    words = common_words.keys
    words.sort! { |a, b| common_words[b] <=> common_words[a]}
    common_words = {}

    # insert into hash
    words.each_with_index do |word, index|
      common_words[word] = index
    end
    puts "Read google words"
    common_words
  end


  def cl_read_dict_words(filename)
    file = File.open(filename, 'r')
    words = []
    file.each do |line|
      word = line.chomp
      if /^[a-z]*$/.match(word) 
        words << word 
      end
    end
    puts "Read dict words"
    words
  end

  def cl_save_words(bing_common_words, google_common_words, dict_words)
    dict_words.each do |word|
      jword = Word.find_by_word(word) ? Word.find_by_word(word) : Word.new(:word => word)
      jword.grade = 3
      puts "Trying to save #{word}"
      stem = word.stem

      bing_rank = google_rank = LARGE_NUM
      bing_rank = bing_common_words[stem] if bing_common_words[stem]
      google_rank = google_common_words[stem] if google_common_words[stem]
      pop_rank = bing_rank < google_rank ? bing_rank : google_rank

      jword.pop_rank = pop_rank
      success = jword.get_audio(1)
      filename = ::Rails.root.to_s + "/public/assets/audios/#{word}.mp3"
      filetype = `file #{filename}`
      puts filetype
      if !(/MPEG/.match(filetype))
        `rm -f #{filename}`
        success = jword.get_audio(2)
        filetype = `file #{filename}`
        puts filetype
      end
      if (success)
        puts "Saved #{word} with rank #{pop_rank}, bing_rank = #{bing_rank}, google_rank = #{google_rank}"
        jword.save
      else
        puts "Failed to create #{word}" if !success
      end
      sleeptime = rand(5)
      puts "sleeping for #{sleeptime} sec"
      sleep(sleeptime)
    end
  end

  task :read_class_words, :filename do |t, args|
    Rake::Task["environment"].invoke
    args.with_defaults(:filename => "/home/ubuntu/jumble/doc/class1.txt")
    bing_common_words = cl_read_common_words
    google_common_words = cl_read_common_words_google
    dict_words = cl_read_dict_words(args[:filename])
    cl_save_words(bing_common_words, google_common_words, dict_words)
  end
end

