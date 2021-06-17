\c nc_news_test

    select * from articles;
    
    SELECT articles.*, COUNT (comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      -- WHERE topic = 'cats'
       GROUP BY articles.article_id
       ORDER BY topic asc;

     
select created_at, article_id, title, votes from articles
order by created_at desc;

SELECT articles.*, COUNT(comment_id) AS number_of_comments 
FROM articles 
LEFT JOIN comments ON articles.article_id = comments.article_id
WHERE articles.article_id = 9
GROUP BY articles.article_id;


