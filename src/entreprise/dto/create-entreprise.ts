import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator'

export class CreateEntrepriseDto {
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "Compagny's name",
    example: 'Compagny Name',
  })
  compagnyName: string

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "Entreprise's name",
    example: 'Entreprise Name',
  })
  name: string

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: 'Country',
    example: 'France',
  })
  country: string

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: 'Address',
    example: '1 rue de la maison',
  })
  address: string

  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: 'City',
    example: 'Paris',
  })
  city: string

  @IsString()
  @Length(1, 10)
  @ApiProperty({
    type: Number,
    minimum: 1,
    maximum: 10,
    description: 'Postal code',
    example: '75001',
  })
  postalCode: string

  @IsString()
  @Length(14, 14)
  @ApiProperty({
    type: String,
    minimum: 14,
    maximum: 14,
    description: 'Siret number',
    example: '12345678901234',
  })
  siretNumber: string

  @IsPhoneNumber()
  @ApiProperty({
    type: String,
    description: 'Phone number',
    example: '+33612345678',
  })
  phoneNumber: string

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "User's email",
    example: 'john.doe@gmail.com',
  })
  email?: string | null

  @IsOptional()
  @IsString()
  @Length(1, 255)
  @ApiProperty({
    type: String,
    minimum: 1,
    maximum: 255,
    description: "Entreprise's website",
    example: 'https://johndoe.com',
  })
  website?: string | null
}
