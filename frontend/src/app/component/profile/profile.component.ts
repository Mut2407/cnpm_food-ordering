import { Component, OnInit } from '@angular/core';
import { UserDTO } from '../../dto/auth/UserDTO';
import { UserService } from '../../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  // user : UserDTO | null = null;
  profileForm: FormGroup;
  selectedFile: File | undefined = undefined;
  profileImageUrl: string = '';
  errorMessages: string = '';
  successMessage: string = '';
  

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe((profile) => {
      this.profileForm.patchValue({
        username: profile.username,
        email: profile.email,
        address: profile.address,
      });
      this.profileImageUrl = profile.profileImageUrl;
    },
    (error) => {
      console.error('Không thể tải hồ sơ', error);
      this.errorMessages = 'Không tải được dữ liệu hồ sơ người dùng.';
    },
  );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
    // Submit form
    onSubmit(): void {
     if (this.profileForm.valid) {
       const profileData = this.profileForm.value;
       this.userService.updateProfile(profileData, this.selectedFile).subscribe(
         (response) => {
           console.log('Cập nhật hồ sơ thành công', response);
           this.successMessage = 'Cập nhật hồ sơ thành công';
           this.profileImageUrl = response.profileImageUrl;
         },
         (error) => {
           console.error('Không thể cập nhật hồ sơ', error);
           this.errorMessages = error.message || 'Đã xảy ra lỗi khi cập nhật hồ sơ.';
         }
       );
     }
    }

    viewMyOrders() {
      this.router.navigate(['/my-orders']);
      console.log('Điều hướng đến trang đơn hàng...');
    }
}