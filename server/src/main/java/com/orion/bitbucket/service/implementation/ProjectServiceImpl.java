package com.orion.bitbucket.service.implementation;

import com.google.gson.Gson;
import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.orion.bitbucket.config.EntityConfig;
import com.orion.bitbucket.config.UtilConfig;
import com.orion.bitbucket.entity.project.ProjectEntity;
import com.orion.bitbucket.entity.project.ProjectValuesEntity;
import com.orion.bitbucket.helper.EndPointsHelper;
import com.orion.bitbucket.helper.LogHelper;
import com.orion.bitbucket.helper.MessageHelper;
import com.orion.bitbucket.repository.ProjectRepository;
import com.orion.bitbucket.service.IProjectService;
import com.orion.bitbucket.util.JsonResponseServiceImpl;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Data
@Log4j2
@NoArgsConstructor
public class ProjectServiceImpl implements IProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private EntityConfig entityConfig;
    @Autowired
    private UtilConfig utilConfig;
    @Autowired
    private JsonResponseServiceImpl response;

    public boolean getProjectsFromAPI(String url) throws JSONException {
        String urlAdd = "?limit=100&start=";
        int start = 0;
        boolean isLastPage = false;
        try {
            ProjectEntity entity = entityConfig.getProjectsEntity();
            Gson gson = utilConfig.getGson();
            while (!isLastPage) {
                HttpResponse<JsonNode> httpResponse = response.getResponse(url + urlAdd + start, EndPointsHelper.Bearer.TOKEN);
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

                    ProjectValuesEntity jsonToValuesEntity = gson.fromJson(body.getJSONArray("values").get(i).toString(), ProjectValuesEntity.class);
                    entity.setValues(jsonToValuesEntity);
                    projectRepository.save(entity);


                    forStart = forStart + 1;
                }
                start = start + 100;
                isLastPage = body.getBoolean("isLastPage");

            }
            return true;

        } catch (Exception err) {
            return false;
        }
    }
}
