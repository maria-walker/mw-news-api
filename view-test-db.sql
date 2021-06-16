\c nc_news_test

select article_id, title, votes from articles;

SELECT articles.*, COUNT(comment_id) AS number_of_comments 
FROM articles 
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = 9
GROUP BY articles.article_id;


--SELECT * FROM comments;