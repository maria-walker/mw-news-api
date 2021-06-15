const {
  formatTopics,
  formatUsers,
  formatArticles,
  formatComments,
} = require("../db/utils/data-manipulation");

describe("formatTopics()", () => {
  test("returns an empty array if no topics are passed ", () => {
    expect(formatTopics([])).toEqual([]);
  });
  test("each topic obj is replaces with an array ", () => {
    const input = [
      { slug: "a", description: "b" },
      { slug: "c", description: "d" },
    ];

    const actual = formatTopics(input);

    const expected = [
      ["a", "b"],
      ["c", "d"],
    ];
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input data", () => {
    const input = [
      { slug: "a", description: "b" },
      { slug: "c", description: "d" },
    ];

    const unmutatedInput = [
      { slug: "a", description: "b" },
      { slug: "c", description: "d" },
    ];
    formatTopics(input);
    expect(input).toEqual(unmutatedInput);
  });
});

describe("formatUsers()", () => {
  test("returns an empty array if no users are passed ", () => {
    expect(formatUsers([])).toEqual([]);
  });
  test("each user obj is replaces with an array ", () => {
    const input = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
      {
        username: "grumpy19",
        name: "Paul Grump",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      },
    ];

    const actual = formatUsers(input);

    const expected = [
      [
        "tickle122",
        "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
        "Tom Tickle",
      ],

      [
        "grumpy19",
        "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
        "Paul Grump",
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input data", () => {
    const input = [
      {
        username: "tickle122",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
        name: "Tom Tickle",
      },
      {
        username: "grumpy19",
        name: "Paul Grump",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      },
    ];

    const unmutatedInput = [
      {
        username: "tickle122",
        name: "Tom Tickle",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
      },
      {
        username: "grumpy19",
        name: "Paul Grump",
        avatar_url:
          "https://vignette.wikia.nocookie.net/mrmen/images/7/78/Mr-Grumpy-3A.PNG/revision/latest?cb=20170707233013",
      },
    ];
    formatUsers(input);
    expect(input).toEqual(unmutatedInput);
  });

  describe("formatArticles()", () => {
    test("returns an empty array if no articles are passed ", () => {
      expect(formatArticles([])).toEqual([]);
    });
    test("each article obj is replaces with an array ", () => {
      const input = [
        {
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: new Date(1591438200000),
        },
        {
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: new Date(1589433300000),
        },
      ];

      const actual = formatArticles(input);

      const expected = [
        [
          "They're not exactly dogs, are they?",
          "Well? Think about it.",
          "mitch",
          "butter_bridge",
          new Date(1591438200000),
        ],
        [
          "Seven inspirational thought leaders from Manchester UK",
          "Who are we kidding, there is only one, and it's Mitch!",
          "mitch",
          "rogersop",
          new Date(1589433300000),
        ],
      ];
      expect(actual).toEqual(expected);
    });
    test("does not mutate the input data", () => {
      const input = [
        {
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: new Date(1591438200000),
        },
        {
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: new Date(1589433300000),
        },
      ];

      const unmutatedInput = [
        {
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: new Date(1591438200000),
        },
        {
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: new Date(1589433300000),
        },
      ];
      formatArticles(input);
      expect(input).toEqual(unmutatedInput);
    });
  });
});

describe.only("formatComments()", () => {
  test("returns an empty array if no comments are passed ", () => {
    expect(formatComments([], [])).toEqual([]);
  });

  test("each comment obj is replaced with an array containing article_id", () => {
    const commentInput = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: new Date(1604113380000),
      },
    ];

    const articleInput = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: new Date(1591438200000),
      },
    ];

    const actual = formatComments(commentInput, articleInput);

    const expected = [
      [
        "butter_bridge",
        2,
        16,
        new Date(1586179020000),
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      ],

      [
        "butter_bridge",
        1,
        14,
        new Date(1604113380000),
        "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      ],
    ];
    expect(actual).toEqual(expected);
  });
  test("does not mutate the input data", () => {
    const commentInput = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: new Date(1604113380000),
      },
    ];

    const articleInput = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: new Date(1591438200000),
        votes: 100,
      },
    ];

    const unmutatedCommentInput = [
      {
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: new Date(1586179020000),
      },
      {
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: new Date(1604113380000),
      },
    ];

    const unmutatedArticleInput = [
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1594329060000),
        votes: 100,
      },
      {
        article_id: 2,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: new Date(1591438200000),
        votes: 100,
      },
    ];
    formatComments(commentInput, articleInput);

    expect(commentInput).toEqual(unmutatedCommentInput);
  });
});
