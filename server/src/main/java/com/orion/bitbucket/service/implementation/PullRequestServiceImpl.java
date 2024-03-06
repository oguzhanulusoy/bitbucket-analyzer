package com.orion.bitbucket.service.implementation;
import com.google.gson.Gson;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.orion.bitbucket.config.UtilConfig;
import com.orion.bitbucket.entity.pull_request.PREntity;
import com.orion.bitbucket.entity.pull_request.PRValuesEntity;
import com.orion.bitbucket.helper.EndPointsHelper;
import com.orion.bitbucket.helper.LogHelper;
import com.orion.bitbucket.helper.MessageHelper;
import com.orion.bitbucket.repository.PullRequestRepository;
import com.orion.bitbucket.service.IPullRequestService;
import com.orion.bitbucket.util.CollectionNameHolder;
import com.orion.bitbucket.util.JsonResponseServiceImpl;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@Data // setter, getter, toString, constructorWithArgs, HashCode.. together
@NoArgsConstructor // default constructor
public class PullRequestServiceImpl implements IPullRequestService {
    @Autowired
    private UtilConfig utilConfig;
    @Autowired
    private PullRequestRepository pullRequestRepository;
    @Autowired
    private JsonResponseServiceImpl response;

    // this method get all prs and save to MongoDB

    // find one or more documents with user email if there is.

    @Override
    public boolean getPullRequestFromAPI(String url, String collectionName, PREntity entity) throws JSONException {
        int start = 0;
        boolean isLastPage = false;
        try {
            Gson gson = utilConfig.getGson();
            CollectionNameHolder.set(collectionName);
            while (!isLastPage) {

                HttpResponse<JsonNode> httpResponse = response.getResponse(url + start, EndPointsHelper.Bearer.TOKEN);
                JSONObject body = httpResponse.getBody().getObject(); // JSONObject
                int forStart = start;
                // this cycle take a response which has 100 values, and break into pieces for all value per.
                for (int i = 0; i < body.getInt("size"); i++) {
                    entity.setSize(1);
                    entity.setLimit(1);
                    entity.setStart(forStart);
                    // if just work for last value
                    if (body.getInt("size") < 100 && (i + 1 == body.getJSONArray("values").length())) {
                        entity.setIsLastPage(true);
                        entity.setNextPageStart(-1);
                    } else {
                        entity.setIsLastPage(false);
                        entity.setNextPageStart(forStart + 1);
                    }
                    // checking which entity
                    PRValuesEntity jsonToValuesEntity = gson.fromJson(body.getJSONArray("values").get(i).toString(), PRValuesEntity.class);
                    entity.setValues(jsonToValuesEntity);
                    pullRequestRepository.save(entity);
                    forStart = forStart + 1;
                }

                start = start + 100;
                isLastPage = body.getBoolean("isLastPage");
            }

            return true;
        } catch (Exception err) {

            return false;
        }
        finally {
            CollectionNameHolder.reset();
        }
    }
}

