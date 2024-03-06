package com.orion.bitbucket.service.implementation;
import com.google.gson.Gson;
import com.mongodb.BasicDBObject;
import com.mongodb.client.*;
import com.mongodb.client.model.*;
import com.orion.bitbucket.config.EntityConfig;
import com.orion.bitbucket.config.UtilConfig;
import com.orion.bitbucket.entity.project.ProjectEntity;
import com.orion.bitbucket.entity.project.ProjectValuesEntity;
import com.orion.bitbucket.entity.pull_request.PREntity;
import com.orion.bitbucket.entity.pull_request.PRValuesEntity;
import com.orion.bitbucket.helper.DatabaseHelper;
import com.orion.bitbucket.helper.LogHelper;
import com.orion.bitbucket.helper.MessageHelper;
import com.orion.bitbucket.helper.QueryHelper;
import com.orion.bitbucket.service.IQueryService;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;
@Data
@Log4j2 // for logging
@NoArgsConstructor
@Component
public class QueryServiceImpl implements IQueryService {
    @Autowired
    private EntityConfig entityConfig;
    @Autowired
    private UtilConfig utilConfig;
    public List<PREntity> getAllPullRequests(String query, String condition, String[] collectionNames) {
        List<PREntity> resutlAPI = new ArrayList<PREntity>();
        Gson gson = utilConfig.getGson();

        for (String collectionName : collectionNames) {
            try (MongoClient mongoClient = MongoClients.create(DatabaseHelper.DATABASE_URL)) {
                if (LogHelper.IS_BASE_LOGGING) {
                    log.info(MessageHelper.QUERY_SERVICE_IMPL_INVOKED_INFO_MESSAGE + collectionName);
                }
                BasicDBObject basicQuery = getQuery(query, condition);
                MongoDatabase database = mongoClient.getDatabase(DatabaseHelper.DATABASE_NAME);
                MongoCollection<Document> collection = database.getCollection(collectionName);
                MongoCursor<Document> cursor = collection.find(basicQuery).iterator();
                while (cursor.hasNext()) {
                    PREntity entity = entityConfig.getPrototypePullRequestEntity(); // must create a new instance
                    Document doc = cursor.next();
                    Document values = (Document) doc.get("values");
                    JSONObject jsonObject = new JSONObject(doc.toJson());
                    entity.setId(jsonObject.getJSONObject("_id").getString("$oid"));
                    entity.setSize(jsonObject.getInt("size"));
                    entity.setLimit(jsonObject.getInt("limit"));
                    entity.setIsLastPage(jsonObject.getBoolean("isLastPage"));
                    entity.setStart(jsonObject.getInt("start"));
                    entity.setNextPageStart(jsonObject.getInt("nextPageStart"));
                    entity.setValues(gson.fromJson(values.toJson(), PRValuesEntity.class));
                    resutlAPI.add(entity);
                }

            } catch (Exception err) {
                if (LogHelper.IS_BASE_LOGGING) {
                    log.error(MessageHelper.QUERY_SERVICE_IMPL_ERROR_MESSAGE, err);
                }
            } finally {
                if (LogHelper.IS_BASE_LOGGING) {
                    log.info(MessageHelper.QUERY_SERVICE_IMPL_FINALLY_INFO_MESSAGE);
                }
            }
        }
        return resutlAPI;
    }

    public BasicDBObject getQuery(String query, String condition) {
        BasicDBObject basicQuery = new BasicDBObject();
        try {
            if(LogHelper.IS_BASE_LOGGING){
                log.info(MessageHelper.QUERY_SERVICE_IMPL_GET_QUERY_INVOKED_INFO_MESSAGE);
            }
            if (!query.isEmpty() && !condition.isEmpty()) {
                if (condition.toLowerCase().equals("true") || condition.toLowerCase().equals("false")) {
                    boolean boolCondition = Boolean.parseBoolean(condition);
                    basicQuery.put(query, boolCondition);
                } else {
                    basicQuery.put(query, condition);

                }
            }
        }
        catch (Exception err){
            if (LogHelper.IS_BASE_LOGGING) {
                log.error(MessageHelper.QUERY_SERVICE_IMPL_GET_QUERY_ERROR_MESSAGE, err);
            }
        }
        finally {
            if (LogHelper.IS_BASE_LOGGING) {
                log.info(MessageHelper.QUERY_SERVICE_IMPL_GET_QUERY_FINALLY_INFO_MESSAGE);
            }
        }

        return basicQuery;
    }


    @Override
    public String updateTeamNames(String[] userName, String teamNameText, String[] collectionNames) {
        String resultText = "";
        try (MongoClient mongoClient = MongoClients.create(DatabaseHelper.DATABASE_URL)) {
            for (String collectionName : collectionNames) {
                if (LogHelper.IS_BASE_LOGGING) {
                    log.info("updateTeamNames method in QueryServiceImpl class was invoked for " + collectionName);
                }
                MongoDatabase database = mongoClient.getDatabase(DatabaseHelper.DATABASE_NAME);
                MongoCollection<Document> collection = database.getCollection(collectionName);
                for (int i = 0; i < userName.length; i++) {
                    // ---------- authors-------------
                    Bson query = Filters.eq(QueryHelper.VALUES_AUTHOR_USER_NAME, userName[i]);
                    Bson updates = Updates.set(QueryHelper.VALUES_AUTHOR_TEAMNAME, teamNameText);
                    collection.updateMany(query, updates);
                    //------ reviewers-------------
                    Bson filter = Filters.eq(QueryHelper.VALUES_REVIEWERS_USER_NAME, userName[i]);
                    Bson update = Updates.set(QueryHelper.VALUES_REVIEWERS_USER_TEAMNAME, teamNameText);
                    collection.updateMany(filter, update);
                }
            }
            resultText = "Team name updates are successful";

        } catch (Exception err) {
        }
        return resultText;
    }
    @Override
    public List<ProjectEntity> getProjectsFromDB(String query, String condition, String collectionName) {
        List<ProjectEntity> resutlAPI = new ArrayList<ProjectEntity>();
        Gson gson = utilConfig.getGson();

        try (MongoClient mongoClient = MongoClients.create(DatabaseHelper.DATABASE_URL)) {
            BasicDBObject basicQuery = getQuery(query, condition);
            MongoDatabase database = mongoClient.getDatabase(DatabaseHelper.DATABASE_NAME);
            MongoCollection<Document> collection = database.getCollection(collectionName);
            MongoCursor<Document> cursor = collection.find(basicQuery).iterator();
            while (cursor.hasNext()) {
                ProjectEntity entity = entityConfig.getPrototypeProjecttEntity(); // must create a new instance
                Document doc = cursor.next();
                Document values = (Document) doc.get("values");
                JSONObject jsonObject = new JSONObject(doc.toJson());
                entity.setId(jsonObject.getJSONObject("_id").getString("$oid"));
                entity.setSize(jsonObject.getInt("size"));
                entity.setLimit(jsonObject.getInt("limit"));
                entity.setIsLastPage(jsonObject.getBoolean("isLastPage"));
                entity.setStart(jsonObject.getInt("start"));
                entity.setNextPageStart(jsonObject.getInt("nextPageStart"));
                entity.setValues(gson.fromJson(values.toJson(), ProjectValuesEntity.class));
                resutlAPI.add(entity);
            }
        } catch (Exception err) {

        }
        return resutlAPI;
    }


}



/*

 Document values = (Document) doc.get("values");
                        JSONObject jsonObject = new JSONObject(doc.toJson());
                        entity.setId(jsonObject.getJSONObject("_id").getString("$oid"));
                        entity.getValues().getAuthor().setTeamName(teamNameText);
                        entity.setValues(gson.fromJson(values.toJson(), PRValuesEntity.class));
                        resutlAPI.add(entity);
 */