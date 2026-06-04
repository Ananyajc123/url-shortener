package com.urlshortener.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true, nullable = false) private String email;
    @Column(nullable = false) private String password;
    @Column(nullable = false) private String name;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY) private List<Url> urls;
    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
    public User() {} 
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public LocalDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<Url> getUrls() { return urls; } public void setUrls(List<Url> urls) { this.urls = urls; }
    public static UserBuilder builder() { return new UserBuilder(); }
    public static class UserBuilder {
        private String email, password, name;
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public User build() { User u = new User(); u.email = email; u.password = password; u.name = name; return u; }
    }
}
