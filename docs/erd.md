# ERD (Mermaid)

The following diagram describes the main relational entities of the Prisma schema used by Edu_Connect.

```mermaid
erDiagram
    USER ||--o{ APPLICATION : applies
    USER ||--o{ PAYMENT : makes
    INSTITUTION ||--o{ PROGRAM : offers
    INSTITUTION ||--o{ APPLICATION : receives
    APPLICATION }o--|| PROGRAM : targets

    USER {
      String id PK
      String firstName
      String lastName
      String email
      String? phoneNumber
      String? nectaIndex
      Role role
      DateTime createdAt
    }

    INSTITUTION {
      String id PK
      String name
      String region
      String type
      Int capacity
      DateTime createdAt
    }

    PROGRAM {
      String id PK
      String institutionId FK
      String name
      Int minimumPoints
      DateTime applicationOpen
      DateTime applicationClose
    }

    APPLICATION {
      String id PK
      String userId FK
      String institutionId FK
      String program
      String[] choiceOrder
      ApplicationStatus status
      DateTime createdAt
    }

    PAYMENT {
      String id PK
      String userId FK
      Decimal amount
      String provider
      String reference
      PaymentStatus status
      DateTime createdAt
    }
```
