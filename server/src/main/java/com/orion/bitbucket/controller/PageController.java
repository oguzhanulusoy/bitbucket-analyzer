package com.orion.bitbucket.controller;

import com.orion.bitbucket.config.EntityConfig;
import com.orion.bitbucket.helper.*;
import com.orion.bitbucket.service.IPullRequestService;
import com.orion.bitbucket.service.IProjectService;
import com.orion.bitbucket.service.implementation.JiraService;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Data
@Log4j2
@NoArgsConstructor
@RequestMapping(path = "/api/v1")
public class PageController {
    @Autowired
    private IProjectService projectsService;
    @Autowired
    private IPullRequestService pullRequestService;
    @Autowired
    private EntityConfig entityConfig;
    @Autowired
    private JiraService jiraService;

    // this method get all data from API and save them into MongoDB
    @CrossOrigin
    @GetMapping(ControllerHelper.URL_GET_All_DATA_FROM_API) // url --> /setup
    public ResponseEntity<String> getAllData() {
        try {
            projectsService.getProjectsFromAPI(EndPointsHelper.BASE_URL);
            pullRequestService.getPullRequestFromAPI(EndPointsHelper.ASRV_MCP_CORE_ROOT_URL,
                    DatabaseHelper.ASRV_REPO_MCP_CORE_ROOT, entityConfig.getPullRequestEntity());

            pullRequestService.getPullRequestFromAPI(EndPointsHelper.ASRV_AS_RAF_CORE_URL,
                    DatabaseHelper.ASRV_REPO_AS_RAF_CORE, entityConfig.getPullRequestEntity());

            pullRequestService.getPullRequestFromAPI(EndPointsHelper.IAC_IAC_URL,
                    DatabaseHelper.IAC_REPO_IAC, entityConfig.getPullRequestEntity());

            pullRequestService.getPullRequestFromAPI(EndPointsHelper.ASRV_PLATFORM_URL,
                    DatabaseHelper.ASRV_PLATFORM, entityConfig.getPullRequestEntity());

            pullRequestService.getPullRequestFromAPI(EndPointsHelper.NG_PROV_UI_URL,
                    DatabaseHelper.NG_PROV_UI, entityConfig.getPullRequestEntity());

            pullRequestService.getPullRequestFromAPI(EndPointsHelper.NG_PA_UI_URL,
                    DatabaseHelper.NG_PA_UI, entityConfig.getPullRequestEntity());


        } catch (Exception ex) {
            //log.error(MessageHelper.PAGE_CONTROLLER_GET_ALL_DATA_ERROR_MESSAGE, ex);
            return null;
        }
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(MessageHelper.GET_ALL_DATA_SUCCESS_MESSAGE);
    }

    @CrossOrigin
    @GetMapping("/jira/{jiraID}")
    JiraData getJiraData(@PathVariable String jiraID) {
        return jiraService.sendRequest(jiraID);
    }
}
