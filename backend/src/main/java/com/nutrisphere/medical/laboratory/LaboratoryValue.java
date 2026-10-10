package com.nutrisphere.medical.laboratory;

import com.nutrisphere.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "laboratory_values")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LaboratoryValue extends BaseEntity {
    @Column(name = "report_id", nullable = false) private Long reportId;
    @Column(name = "parameter_name", nullable = false) private String parameterName;
    @Column(name = "value") private String value;
    @Column(name = "unit") private String unit;
    @Column(name = "normal_range") private String normalRange;
    @Column(name = "flag") private String flag;
}
