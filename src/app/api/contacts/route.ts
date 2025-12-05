import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') // customer, vendor, both

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      )
    }

    const where: any = { companyId }

    if (type) {
      where.type = type
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    const contacts = await prisma.contact.findMany({
      where,
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: contacts })
  } catch (error) {
    console.error('Get contacts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const companyId = request.headers.get('x-company-id')
    const userId = request.headers.get('x-user-id')
    
    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'Company ID and User ID required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { 
      type, 
      code, 
      name, 
      nameEn, 
      taxId, 
      branchCode,
      contactName,
      phone, 
      email, 
      creditTerm, 
      creditLimit,
      defaultWhtRate,
      tags,
      notes,
      address 
    } = body

    // Validate required fields
    if (!type || !name) {
      return NextResponse.json(
        { error: 'Type and name are required' },
        { status: 400 }
      )
    }

    // Check if code already exists
    if (code) {
      const existing = await prisma.contact.findFirst({
        where: { companyId, code },
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Contact code already exists' },
          { status: 400 }
        )
      }
    }

    // Create contact with address
    const contact = await prisma.contact.create({
      data: {
        companyId,
        type,
        code,
        name,
        nameEn,
        taxId,
        branchCode: branchCode || '00000',
        contactName,
        phone,
        email,
        creditTerm: creditTerm || 30,
        creditLimit,
        defaultWhtRate,
        tags: tags || [],
        notes,
        createdBy: userId,
        addresses: address ? {
          create: {
            type: 'billing',
            label: 'ที่อยู่หลัก',
            address: address.address,
            district: address.district,
            subDistrict: address.subDistrict,
            province: address.province,
            postalCode: address.postalCode,
            country: address.country || 'Thailand',
            isDefault: true,
          },
        } : undefined,
      },
      include: {
        addresses: true,
      },
    })

    return NextResponse.json({ success: true, data: contact }, { status: 201 })
  } catch (error) {
    console.error('Create contact error:', error)
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    )
  }
}

