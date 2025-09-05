'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Candidate } from '@/lib/types';
import { Save, Upload, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

interface ProfileFormProps {
  candidate: Candidate;
}

export function ProfileFormPersonal({ candidate }: ProfileFormProps) {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          This is your public-facing information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
         <div className="flex items-center gap-6">
            <div className="relative">
                <Image src={candidate.personalInfo.avatar} alt="Candidate Avatar" width={80} height={80} className="rounded-full" />
                <Button size="icon" variant="outline" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                    <Upload className="h-4 w-4" />
                    <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                </Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="photo-upload">Profile Photo</Label>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
            </div>
         </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue={candidate.personalInfo.firstName} placeholder="e.g. John" />
            </div>
            <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue={candidate.personalInfo.lastName} placeholder="e.g. Doe"/>
            </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="headline">Headline</Label>
          <Input id="headline" defaultValue={candidate.personalInfo.headline} placeholder="e.g. Senior Frontend Developer"/>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center">
                    <Mail className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue={candidate.personalInfo.email} className="pl-10" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                 <div className="relative flex items-center">
                    <Phone className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" defaultValue={candidate.personalInfo.phone} className="pl-10" />
                </div>
            </div>
         </div>
         <div>
            <Label>Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="space-y-2">
                    <Label htmlFor="division" className="text-xs">Division</Label>
                    <Input id="division" defaultValue={candidate.personalInfo.address.division} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="district" className="text-xs">District</Label>
                    <Input id="district" defaultValue={candidate.personalInfo.address.district} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="upazila" className="text-xs">Upazila / Thana</Label>
                    <Input id="upazila" defaultValue={candidate.personalInfo.address.upazila} />
                </div>
            </div>
             <div className="space-y-2 mt-4">
                <Label htmlFor="addressLine1" className="text-xs">Address Line 1</Label>
                <Input id="addressLine1" defaultValue={candidate.personalInfo.address.line1} />
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
      </CardFooter>
    </Card>
  )
}
