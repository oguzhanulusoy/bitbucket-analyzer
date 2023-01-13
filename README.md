Will be modified as soon as possible.

*** Bitbucket Tool for Orion Innovation Turkey ***

----- SERVER SIDE -----

--> please for setup look A Group
--> please for adding a new project and repo to code look B Group


** A GROUP
-setups-

1-) MongoDB setup:
--> Download MongoDB on its website: https://www.mongodb.com/try/download/community
--> click next and next buttons to setup MongoDB

2-) Download a Code Editor ( in this part IntellijIdea was used):
--> Download IntellijIdea on its website: https://www.jetbrains.com/idea/download/#section=windows

3-) Download this project on github

4-) Open this project with IntellijIdea and open pom.xml file and update these all dependencies with Maven.

5-) open java/resources/application.properties. İt should be like following. (might be changed, exmp. server.port:8080)
        server.port:8989
        spring.data.mongodb.host=localhost
        spring.data.mongodb.port=27017
        spring.data.mongodb.database=bitbucket
        spring.data.mongodb.url=mongodb://localhost:27017
        spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration

6-) !IMPORTANT! Open helpers directory and EndPointsHepler class and paste your token in following field in Bearer class
        public static final String TOKEN=" your token should be pasted to here"

7-) Connection MongoDB:
--> click MongoDB app on desktop.
--> connect to MongoDB but be careful about 5th step. on MongoDB screen you might find host info.

8-) Run Program.


** B GROUP
-adding a new repo to code-

1-) go to DatabaseHelper class and create a new project name, repo name and create a collection name with created project name and repo name.

2-) go to EndpointHelper class and create a new url for project and repo. be able to use DatabaseHelper project name and repo name in your url. 
-please check old url for understanding-

3-) go to PageController class and use this pullRequestService.getPullRequestFromAPI(EndPointsHelper.YOUR_URL,
DatabaseHelper.YOUR_COLLECTION_NAME, entityConfig.getPullRequestEntity());
-this method will return a boolean. if it is success, will return true. otherwise false-

4-) Run Program.



----- CLIENT SIDE -----

