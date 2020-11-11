class CreateUsers < ActiveRecord::Migration[5.2]
  def self.up
    create_table :users do |t|
      t.string :name
      t.timestamps
    end
    add_index :users, :name
  end

  def self.down
    drop_table :users
  end
end
