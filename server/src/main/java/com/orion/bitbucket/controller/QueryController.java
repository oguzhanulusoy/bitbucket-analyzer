package com.orion.bitbucket.controller;

import com.orion.bitbucket.entity.project.ProjectEntity;
import com.orion.bitbucket.entity.pull_request.PREntity;
import com.orion.bitbucket.helper.ControllerHelper;
import com.orion.bitbucket.helper.DatabaseHelper;
import com.orion.bitbucket.helper.LogHelper;
import com.orion.bitbucket.helper.MessageHelper;
import com.orion.bitbucket.service.implementation.QueryServiceImpl;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Log4j2
@NoArgsConstructor
@RestController
@RequestMapping(path = "/api/v1")
@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
public class QueryController {
    //FIELDS
    @Autowired
    private QueryServiceImpl queryService;

    // This method get all pull requests
    @CrossOrigin(origins = "*", maxAge = 3600)
    @GetMapping(path = ControllerHelper.URL_GET_DATA_FROM_DB) // url --> /get-data
    public ResponseEntity<List<PREntity>> getAllPullRequests(@RequestParam(name = "query", required = false, defaultValue = "") String query,
                                                             @RequestParam(name = "condition", required = false, defaultValue = "") String condition) {
        List<PREntity> resultAPI = new ArrayList<PREntity>();
        resultAPI = queryService.getAllPullRequests(query, condition, DatabaseHelper.ALL_COLLECTIONS_ARRAY);
        return ResponseEntity.status(HttpStatus.OK).body(resultAPI);
    }

    //This method update team name of authors and reviewers
    @CrossOrigin
    @PutMapping("/update-data/{teamText}")
    public String updateTeamName(@RequestBody String[] IDs, @PathVariable String teamText) {
        String result = "";
        result = queryService.updateTeamNames(IDs, teamText, DatabaseHelper.ALL_COLLECTIONS_ARRAY);
        return result;
    }

    @CrossOrigin
    @GetMapping(path = ControllerHelper.URL_GET_PROJECTS_FROM_DB) // url --> /get-projects
    public ResponseEntity<List<ProjectEntity>> getProjectsFromDB(@RequestParam(name = "query", required = false, defaultValue = "") String query,
                                                                 @RequestParam(name = "condition", required = false, defaultValue = "") String condition) {
        List<ProjectEntity> resultAPI = new ArrayList<ProjectEntity>();
        resultAPI = queryService.getProjectsFromDB(query, condition, DatabaseHelper.PROJECTS);
        return ResponseEntity.status(HttpStatus.OK).body(resultAPI);
    }


}
