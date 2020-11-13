Jumble::Application.routes.draw do

  resources :meanings

  resources :grade_week_words

  resources :grades

  resources :schools

  resources :session_scores

  root :to => "home#home", :via => :get

  get 'math', :to => 'math#index'

  resources :users

  post 'teachers/print_word_box', :to => 'teachers#print_word_box'
  get 'teachers/print_word_box/:id', :to => 'teachers#print_word_box'
  post 'teachers/make_word_box', :to => 'teachers#make_word_box'
  post 'teachers/add_words_db', :to => 'teachers#make_word_box'
  get 'home/find_words/:id', :to => 'home#find_words'
  post 'home/get_meaning', :to => 'home#get_meaning'
  post 'home/update_spell_score', :to => 'home#update_spell_score'

  # Privacy Policy
  get 'privacy', :to => 'main#privacy', :as => :privacy

  # Omniauth routes
  get 'auth/google_oauth2/callback', :to => 'oauth_callbacks#google'
  get 'auth/facebook/callback', :to => 'oauth_callbacks#facebook'
  get 'auth/twitter/callback', :to => 'oauth_callbacks#twitter'
  get 'auth/failure', :to => 'oauth_callbacks#failure'
  get 'logout', :to => 'oauth_callbacks#logout', :as => :logout

  resources :words do
    collection do
      get 'say_word'
    end
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :controller => 'user_sessions', :action => 'new'

  get ':controller/:action'

  # match ':controller/:action/:id'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
