class HelloApp
  def call(env)
    [200, {"Content-Type" => "text/plain"}, ["Hello, Rack"]]
  end
end

use Rack::Static, :urls => ["/"], :root => "."
run HelloApp.new
