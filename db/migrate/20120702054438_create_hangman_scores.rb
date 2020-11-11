class CreateHangmanScores < ActiveRecord::Migration[5.2]
  def self.up
    create_table :hangman_scores do |t|
      t.references :user
      t.references :word
      t.integer    :score
      t.timestamps
    end
  end

  def self.down
    drop_table :hangman_scores
  end
end
