# Firestore Rules (dev)

These are permissive for local/client experiments. Admin SDK bypasses rules.

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      match /events/{eventId} {
        allow read, write: if true;
      }
      match /forumPosts/{postId} {
        allow read, write: if true;
      }
    }
  }
}
```

**Deploy:**
```bash
firebase deploy --only firestore:rules
```
