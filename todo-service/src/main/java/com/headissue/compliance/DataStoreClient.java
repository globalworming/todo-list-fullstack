package com.headissue.compliance;

import com.google.cloud.datastore.Datastore;
import com.google.cloud.datastore.DatastoreOptions;
import com.google.cloud.datastore.Key;
import com.google.cloud.datastore.Entity;

import java.util.UUID;

public class DataStoreClient {
    private final Datastore datastore = DatastoreOptions.getDefaultInstance().getService();

    public Key createRandomDocument() {
        String kind = "HealthTest";
        String name = UUID.randomUUID().toString();
        Key taskKey = datastore.newKeyFactory().setKind(kind).newKey(name);

        // Prepares the new entity
        Entity task = Entity.newBuilder(taskKey).build();

        // Saves the entity
        datastore.put(task);
        return taskKey;
    }

    public void deleteDocument(Key key) {
        datastore.delete(key);
    }
}
