class User < ActiveRecord::Base
  # Verifies that the name is present.
  validates_presence_of :name

  has_many :word_scores
  has_many :session_scores
  has_many :hangman_scores

  # Can have many oauth credentials
  has_many :credentials, :dependent => :destroy

  belongs_to :grade
  
  # Slug the url.
  def to_param
    "#{id}-#{name.parameterize}"
  end

  # Initialize based on returned oauth data.
  # This will create a Credential record if needed.
  # More details at https://github.com/intridea/omniauth/wiki/Auth-Hash-Schema
  def self.initialize_with_oauth_data(data, current_user)
    credential = Credential.find_or_initialize_by_provider_and_uid(data['provider'], data['uid'])
    attrs = data['info'] || {}
    attrs.merge!(data['credentials']) if data['credentials']
    attrs.merge!(data['extra']) if data['extra']
    attrs.delete_if { |k, v| !credential.attributes.keys.include?(k) }
    credential.attributes = attrs
    user = current_user || credential.user || User.new(:name => (credential.nickname.presence || credential.uid))
    credential.user = user
    user.credentials << credential
    # Save user with only OmniAuth data.
    user_saved = user.save ? user : false
    # Retrieve data from Providers::
    credential.update_profile_info if user_saved && !Rails.env.test?
    user_saved
  end

  def is_admin?
    self.is_admin
  end

  def total_spell_stars
    stars = 0
    self.session_scores.each do |session_score|
      stars += session_score.score
    end
    stars
  end

  def total_hangman_stars
    stars = 0
    self.hangman_scores.each do |hangman_score|
      stars += hangman_score.score
    end
    stars
  end

  def print_name
    self.credentials.size > 0 ? 
      (self.credentials[0].name ? self.credentials[0].name.titleize : '') : 
      ''
  end
end
