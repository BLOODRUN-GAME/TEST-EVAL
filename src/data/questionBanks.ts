import type { Question, QuestionEntryMode } from '../types/quiz';

export const curatedQuestions: Question[] = [
  {
    id: 1,
    text: "Which of the following is a programming language?",
    options: [
      { id: 'A', text: "Java" },
      { id: 'B', text: "HTML" },
      { id: 'C', text: "CSS" },
      { id: 'D', text: "SQL" }
    ],
    category: "Programming",
    correctOption: 'A',
    explanation: "Java is a high-level, general-purpose, object-oriented programming language. HTML and CSS are markup/styling languages, while SQL is a database query language."
  },
  {
    id: 2,
    text: "What does CPU stand for in computer systems?",
    options: [
      { id: 'A', text: "Central Processing Unit" },
      { id: 'B', text: "Central Performance User" },
      { id: 'C', text: "Control Processor Unit" },
      { id: 'D', text: "Core Processing Utility" }
    ],
    category: "Computer Science",
    correctOption: 'A',
    explanation: "CPU stands for Central Processing Unit, the primary component that executes instructions."
  },
  {
    id: 3,
    text: "Which data structure follows the First-In, First-Out (FIFO) principle?",
    options: [
      { id: 'A', text: "Stack" },
      { id: 'B', text: "Queue" },
      { id: 'C', text: "Binary Tree" },
      { id: 'D', text: "Heap" }
    ],
    category: "Data Structures",
    correctOption: 'B',
    explanation: "A Queue operates on the First-In, First-Out (FIFO) principle, where the first element inserted is the first one removed."
  },
  {
    id: 4,
    text: "In HTTP, which status code indicates that a requested resource was not found?",
    options: [
      { id: 'A', text: "200" },
      { id: 'B', text: "301" },
      { id: 'C', text: "404" },
      { id: 'D', text: "500" }
    ],
    category: "Web & Networking",
    correctOption: 'C',
    explanation: "HTTP 404 indicates 'Not Found', meaning the server cannot find the requested resource."
  },
  {
    id: 5,
    text: "What is the worst-case time complexity of standard QuickSort?",
    options: [
      { id: 'A', text: "O(n log n)" },
      { id: 'B', text: "O(n)" },
      { id: 'C', text: "O(n²)" },
      { id: 'D', text: "O(1)" }
    ],
    category: "Algorithms",
    correctOption: 'C',
    explanation: "QuickSort's worst-case time complexity is O(n²) when the chosen pivot consistently partitions the array into unbalanced subarrays."
  },
  {
    id: 6,
    text: "Which of the following is NOT an operating system?",
    options: [
      { id: 'A', text: "Linux" },
      { id: 'B', text: "macOS" },
      { id: 'C', text: "Oracle" },
      { id: 'D', text: "Windows" }
    ],
    category: "Operating Systems",
    correctOption: 'C',
    explanation: "Oracle is a database management system / software company, not an operating system."
  },
  {
    id: 7,
    text: "Which protocol is primarily used to securely transfer web pages across the internet?",
    options: [
      { id: 'A', text: "FTP" },
      { id: 'B', text: "HTTPS" },
      { id: 'C', text: "SMTP" },
      { id: 'D', text: "SNMP" }
    ],
    category: "Web & Networking",
    correctOption: 'B',
    explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts communication over TLS/SSL."
  },
  {
    id: 8,
    text: "In JavaScript, which keyword declares a variable with block scope that can be reassigned?",
    options: [
      { id: 'A', text: "var" },
      { id: 'B', text: "let" },
      { id: 'C', text: "const" },
      { id: 'D', text: "static" }
    ],
    category: "Programming",
    correctOption: 'B',
    explanation: "'let' provides block-scoped variables that can be reassigned, whereas 'const' cannot be reassigned and 'var' is function-scoped."
  },
  {
    id: 9,
    text: "What is the primary role of DNS in computer networks?",
    options: [
      { id: 'A', text: "Translating domain names into IP addresses" },
      { id: 'B', text: "Encrypting network passwords" },
      { id: 'C', text: "Allocating RAM to network sockets" },
      { id: 'D', text: "Filtering malicious viruses" }
    ],
    category: "Web & Networking",
    correctOption: 'A',
    explanation: "DNS (Domain Name System) translates human-friendly domain names (e.g. google.com) into numerical IP addresses."
  },
  {
    id: 10,
    text: "Which SQL command is used to remove an entire table and its schema from a database?",
    options: [
      { id: 'A', text: "DELETE TABLE" },
      { id: 'B', text: "DROP TABLE" },
      { id: 'C', text: "REMOVE TABLE" },
      { id: 'D', text: "TRUNCATE" }
    ],
    category: "Databases",
    correctOption: 'B',
    explanation: "DROP TABLE deletes both the table data and definition. DELETE or TRUNCATE only removes rows."
  },
  {
    id: 11,
    text: "Which design pattern ensures a class has only one instance and provides a global access point?",
    options: [
      { id: 'A', text: "Factory Pattern" },
      { id: 'B', text: "Singleton Pattern" },
      { id: 'C', text: "Observer Pattern" },
      { id: 'D', text: "Adapter Pattern" }
    ],
    category: "Software Design",
    correctOption: 'B',
    explanation: "The Singleton Pattern restricts instantiation of a class to a single object."
  },
  {
    id: 12,
    text: "What does the 'ACID' acronym stand for in database transaction management?",
    options: [
      { id: 'A', text: "Atomicity, Consistency, Isolation, Durability" },
      { id: 'B', text: "Accuracy, Completeness, Integrity, Dependability" },
      { id: 'C', text: "Allocation, Coherence, Inspection, Distribution" },
      { id: 'D', text: "Access, Concurrency, Indexing, Decoupling" }
    ],
    category: "Databases",
    correctOption: 'A',
    explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability, guaranteeing valid transactions."
  },
  {
    id: 13,
    text: "Which layer of the OSI model is responsible for end-to-end packet delivery (routing)?",
    options: [
      { id: 'A', text: "Data Link Layer" },
      { id: 'B', text: "Network Layer" },
      { id: 'C', text: "Transport Layer" },
      { id: 'D', text: "Session Layer" }
    ],
    category: "Networking",
    correctOption: 'B',
    explanation: "The Network Layer (Layer 3) handles packet forwarding, addressing, and routing via routers."
  },
  {
    id: 14,
    text: "What does Git use to identify snapshots and commits uniquely?",
    options: [
      { id: 'A', text: "Sequential integers" },
      { id: 'B', text: "SHA-1 / SHA-256 cryptographic hashes" },
      { id: 'C', text: "System timestamps" },
      { id: 'D', text: "MAC addresses" }
    ],
    category: "Dev Tools",
    correctOption: 'B',
    explanation: "Git uses cryptographic checksum hashes (SHA-1/SHA-256) to identify commits, trees, and blobs."
  },
  {
    id: 15,
    text: "In React, which hook is typically used to handle side effects such as data fetching or subscriptions?",
    options: [
      { id: 'A', text: "useState" },
      { id: 'B', text: "useMemo" },
      { id: 'C', text: "useEffect" },
      { id: 'D', text: "useCallback" }
    ],
    category: "Web & Frameworks",
    correctOption: 'C',
    explanation: "useEffect is specifically designed for executing side effects in React function components."
  },
  {
    id: 16,
    text: "What is the binary representation of decimal number 25?",
    options: [
      { id: 'A', text: "11001" },
      { id: 'B', text: "10101" },
      { id: 'C', text: "11100" },
      { id: 'D', text: "10011" }
    ],
    category: "Computer Science",
    correctOption: 'A',
    explanation: "25 = 16 + 8 + 1 = 11001 in base 2."
  },
  {
    id: 17,
    text: "Which of the following is a non-relational (NoSQL) database?",
    options: [
      { id: 'A', text: "PostgreSQL" },
      { id: 'B', text: "MongoDB" },
      { id: 'C', text: "MySQL" },
      { id: 'D', text: "SQLite" }
    ],
    category: "Databases",
    correctOption: 'B',
    explanation: "MongoDB is a document-oriented NoSQL database. PostgreSQL, MySQL, and SQLite are relational."
  },
  {
    id: 18,
    text: "Which sorting algorithm is guaranteed to have O(n log n) running time in all cases (worst, average, best)?",
    options: [
      { id: 'A', text: "Merge Sort" },
      { id: 'B', text: "Bubble Sort" },
      { id: 'C', text: "Insertion Sort" },
      { id: 'D', text: "Selection Sort" }
    ],
    category: "Algorithms",
    correctOption: 'A',
    explanation: "Merge Sort consistently divides the array into halves and merges in linear time, guaranteeing O(n log n)."
  },
  {
    id: 19,
    text: "What is the primary function of an interpreter compared to a compiler?",
    options: [
      { id: 'A', text: "It executes source code line-by-line without producing a standalone machine binary" },
      { id: 'B', text: "It converts entire source code to machine code before execution" },
      { id: 'C', text: "It optimizes hardware clock frequencies" },
      { id: 'D', text: "It manages disk sectors" }
    ],
    category: "Computer Science",
    correctOption: 'A',
    explanation: "An interpreter executes instructions directly line by line, whereas a compiler translates the full program into machine code first."
  },
  {
    id: 20,
    text: "Which cryptographic algorithm is widely used for asymmetric public-key cryptography?",
    options: [
      { id: 'A', text: "AES" },
      { id: 'B', text: "DES" },
      { id: 'C', text: "RSA" },
      { id: 'D', text: "Blowfish" }
    ],
    category: "Security",
    correctOption: 'C',
    explanation: "RSA is an asymmetric cipher using public and private key pairs. AES, DES, and Blowfish are symmetric ciphers."
  },
  {
    id: 21,
    text: "What is the term for a function that calls itself directly or indirectly?",
    options: [
      { id: 'A', text: "Recursive function" },
      { id: 'B', text: "Higher-order function" },
      { id: 'C', text: "Pure function" },
      { id: 'D', text: "Anonymous function" }
    ],
    category: "Programming",
    correctOption: 'A',
    explanation: "A recursive function solves problems by calling itself on smaller subproblems until a base condition is met."
  },
  {
    id: 22,
    text: "Which port is used by default for unencrypted HTTP traffic?",
    options: [
      { id: 'A', text: "21" },
      { id: 'B', text: "22" },
      { id: 'C', text: "80" },
      { id: 'D', text: "443" }
    ],
    category: "Networking",
    correctOption: 'C',
    explanation: "Port 80 is the default standard port for HTTP. Port 443 is for HTTPS, 21 for FTP, and 22 for SSH."
  },
  {
    id: 23,
    text: "Which memory type is volatile and loses its contents when power is turned off?",
    options: [
      { id: 'A', text: "ROM" },
      { id: 'B', text: "RAM" },
      { id: 'C', text: "SSD" },
      { id: 'D', text: "Flash Drive" }
    ],
    category: "Hardware",
    correctOption: 'B',
    explanation: "RAM (Random Access Memory) is volatile temporary working memory that clears when power is lost."
  },
  {
    id: 24,
    text: "What does CSS stand for in web styling?",
    options: [
      { id: 'A', text: "Cascading Style Sheets" },
      { id: 'B', text: "Computer Style System" },
      { id: 'C', text: "Creative Styling Standard" },
      { id: 'D', text: "Centralized Syntax Sheets" }
    ],
    category: "Web & Frameworks",
    correctOption: 'A',
    explanation: "CSS stands for Cascading Style Sheets, used to format the layout and presentation of HTML documents."
  },
  {
    id: 25,
    text: "In Object-Oriented Programming, what is the principle of bundling data with methods that operate on that data called?",
    options: [
      { id: 'A', text: "Inheritance" },
      { id: 'B', text: "Polymorphism" },
      { id: 'C', text: "Encapsulation" },
      { id: 'D', text: "Abstraction" }
    ],
    category: "Software Design",
    correctOption: 'C',
    explanation: "Encapsulation bundles data (attributes) and methods within an object while restricting direct access to internal components."
  }
];

/**
 * Generates N questions based on entryMode.
 * In 'number_based' mode: No question text required! Generates generic A, B, C, D choices.
 * In 'manual' mode: Generates curated or custom questions.
 */
export function generateQuestionSet(count: number, mode: QuestionEntryMode = 'number_based'): Question[] {
  const result: Question[] = [];

  if (mode === 'number_based') {
    for (let i = 1; i <= count; i++) {
      result.push({
        id: i,
        text: `Question ${i}`,
        isNumberBased: true,
        options: [
          { id: 'A', text: 'Option A' },
          { id: 'B', text: 'Option B' },
          { id: 'C', text: 'Option C' },
          { id: 'D', text: 'Option D' }
        ],
        category: 'Score Tracker'
      });
    }
    return result;
  }

  // 'manual' mode
  const baseCount = curatedQuestions.length;
  for (let i = 0; i < count; i++) {
    const baseQuestion = curatedQuestions[i % baseCount];
    const cycle = Math.floor(i / baseCount);
    
    if (cycle === 0) {
      result.push({
        ...baseQuestion,
        id: i + 1,
        isNumberBased: false,
      });
    } else {
      result.push({
        ...baseQuestion,
        id: i + 1,
        isNumberBased: false,
        text: `[Set ${cycle + 1}] ${baseQuestion.text}`,
      });
    }
  }

  return result;
}
