// extract any functions you are using to manipulate your data, into this file
exports.formatTopics = (topicData) => {
  //   return topicData.map(({ slug, description }) => {
  //     return [slug, description];
  //   });
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
    return [
      article.title,
      article.body,
      article.topic,
      article.author,
      article.created_at,
    ];
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
