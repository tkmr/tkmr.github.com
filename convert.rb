Blog.find(2).posts.each do |post|
  create_at = post.create_date.to_s
  p tiny_title = post.title.gsub(/([a-z0-9]*)([^a-z0-9]*)/i, '\1-').downcase.split("-").join("-")
  title = post.title.gsub(/["\[\]]/, '')
  content = <<EOF
---
layout: old_post
title: #{title}
permalink: /tatsuya/show/#{post.to_param}
---
#{post.body}

EOF

  open("/Users/tatsuya/GitHub/tkmr.github.com/_posts/old/#{create_at}-old-#{tiny_title}.html", "w") do |file|
    file << content
  end
end
