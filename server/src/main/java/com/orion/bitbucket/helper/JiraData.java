package com.orion.bitbucket.helper;

public class JiraData {

    private Long openCount;
    private Long mergedCount;

    public Long getOpenCount() {
        return openCount;
    }

    public void setOpenCount(Long openCount) {
        this.openCount = openCount;
    }

    public Long getMergedCount() {
        return mergedCount;
    }

    public void setMergedCount(Long mergedCount) {
        this.mergedCount = mergedCount;
    }

    public JiraData(Long openCount, Long mergedCount) {
        this.openCount = openCount;
        this.mergedCount = mergedCount;
    }
}
