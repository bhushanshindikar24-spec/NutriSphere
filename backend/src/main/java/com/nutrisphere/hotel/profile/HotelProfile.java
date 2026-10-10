package com.nutrisphere.hotel.profile;
import com.nutrisphere.common.BaseEntity;
import com.nutrisphere.user.User;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name = "hotel_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelProfile extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @Column(name = "hotel_name", nullable = false) private String hotelName;
    @Column(name = "hotel_address") private String hotelAddress;
    @Column(name = "phone_number") private String phoneNumber;
    @Column(name = "description", length = 500) private String description;
    @Column(name = "cuisine_type") private String cuisineType;
    @Column(name = "license_number") private String licenseNumber;
    @Column(name = "license_document_url", length = 500) private String licenseDocumentUrl;
    @Column(name = "verification_status") @Builder.Default private String verificationStatus = "APPROVED";
    @Column(name = "is_active") @Builder.Default private boolean active = true;
}
