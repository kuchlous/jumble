class CreateWordScore < ActiveRecord::Migration[5.2]
  def self.up
    create_table :word_scores do |t|
      t.integer :word_id
      t.integer :user_id
      t.integer :wrong
      t.integer :correct
      t.integer :skipped
      t.timestamps
    end
    add_index :word_scores, :user_id
    add_index :word_scores, :word_id

  end

  def self.down
    drop_table :word_scores
  end
end
