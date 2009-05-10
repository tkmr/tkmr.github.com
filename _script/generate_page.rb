100.times do |i|
  content = <<EOF
---
layout: default
title: blog.tkmr.org - page #{i}
---
{% evalassign currentpage = #{i} %}
{% include page.html %}
EOF

  open("./page/#{i}.html", "w") do |file|
    file << content
  end
end
