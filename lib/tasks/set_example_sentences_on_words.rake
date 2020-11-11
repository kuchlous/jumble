namespace :db do

  def read_examples
    sentence_hash = {}
    sentence_array = []
    file = File.open(Rails.root + 'doc/sentences_english_tatoeba_1.tsv', 'r')
    file.each_with_index do |line, index|
      num, lang, sentence = line.split("\t")
      sentence_array << line
      sentence = sentence[0..-3]
      # puts "num = #{num} lang = #{lang} sentence = #{sentence}"
      words = sentence.split
      words.each do |word|
        if word.size > 2
          sentence_hash[word] ||= []
#          if (sentence_hash[word].size < 10)
            sentence_hash[word] << index
#          end
        end
      end
    end
    [sentence_hash, sentence_array]
  end

  def get_sentence_audio(num)
    response = HTTParty.get("https://audio.tatoeba.org/sentences/eng/#{num}.mp3")
    if (response.body) 
      filename = ::Rails.root.to_s + "/public/assets/audios/examples/#{num}.mp3"
      f = File.new(filename, "wb")
      f.write(response.body)
      f.close
      filetype = `file #{filename}`
      return true if (/MPEG/.match(filetype))
      `rm -f #{filename}`
    end
    return false
  end

  desc 'Set the example sentences for the words'
  task :set_example_sentences_on_words, :filename do |t, args|
    Rake::Task["environment"].invoke
    sentence_hash, sentence_array = read_examples
    # puts sentence_hash
    # puts sentence_array
    Word.all.each do |jword|
      next if jword.example_sentences.size > 0
      word = jword.word
      sentence_nums = sentence_hash[word]
      if (sentence_nums) 
        puts "Sentences for word #{word}"
        sentence_nums.sort! { |x, y| sentence_array[x].size <=> sentence_array[y].size }
        found_audio_example = false
        sentence_nums.each do |snum|
          line = sentence_array[snum]
          num, lang, sentence = line.split("\t")
          esentence = ExampleSentence.find_by_tatoeba_id(num)
          if (!esentence)
            success = get_sentence_audio(num)
            if (success)
              puts "Successfully got mp3 for #{line}"
              esentence = ExampleSentence.create(:tatoeba_id => num,
                                                   :text => sentence[0..-3],
                                                   :has_audio => true
                                                  )
            end
          end
          if (esentence && esentence.has_audio)
            puts "Word: #{word} has_audio: true Example: #{esentence.text}"
            esentence.words << jword
            found_audio_example = true
            break
          end
        end
        if !found_audio_example && sentence_nums.size > 0
          line = sentence_array[sentence_nums[0]]
          num, lang, sentence = line.split("\t")
          esentence = ExampleSentence.find_by_tatoeba_id(num)
          esentence ||= ExampleSentence.create(:tatoeba_id => num,
                                               :text => sentence[0..-3],
                                               :has_audio => false
                                              )
          puts "Word: #{word} has_audio: false Example: #{esentence.text}"
          esentence.words << jword
        end
      end
    end
  end
end

