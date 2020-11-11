require "spec_helper"

describe MeaningsController do
  describe "routing" do

    it "routes to #index" do
      get("/meanings").should route_to("meanings#index")
    end

    it "routes to #new" do
      get("/meanings/new").should route_to("meanings#new")
    end

    it "routes to #show" do
      get("/meanings/1").should route_to("meanings#show", :id => "1")
    end

    it "routes to #edit" do
      get("/meanings/1/edit").should route_to("meanings#edit", :id => "1")
    end

    it "routes to #create" do
      post("/meanings").should route_to("meanings#create")
    end

    it "routes to #update" do
      put("/meanings/1").should route_to("meanings#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/meanings/1").should route_to("meanings#destroy", :id => "1")
    end

  end
end
