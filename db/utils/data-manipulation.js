exports.formatTopics = (topicData) => {
  return topicData.map((topic) => {
    return [topic.slug, topic.description];
  });
};

exports.formatUsers = (userData) => {
  return userData.map((user) => {
    return [user.username, user.avatar_url, user.name];
  });
};

exports.formatArticles = (articleData) => {
  return articleData.map((article) => {
    if (Object.keys(article).includes("votes")) {
      return [
        article.title,
        article.body,
        article.votes,
        article.topic,
        article.author,
        article.created_at,
      ];
    } else {
      return [
        article.title,
        article.body,
        0,
        article.topic,
        article.author,
        article.created_at,
      ];
    }
  });
};

exports.formatComments = (commentData, articlesSQL) => {
  let commentsWithArticleId = [];

  commentData.forEach((comment) => {
    articlesSQL.forEach((article) => {
      if (comment.belongs_to === article.title) {
        commentsWithArticleId.push([
          comment.created_by,
          article.article_id,
          comment.votes,
          comment.created_at,
          comment.body,
        ]);
      }
    });
  });

  return commentsWithArticleId;
};
