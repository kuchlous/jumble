class CreateSessionScores < ActiveRecord::Migration[5.2]
  def change
    create_table :session_scores do |t|
      t.integer :user_id
      t.integer :score

      t.timestamps
    end
  end
end
